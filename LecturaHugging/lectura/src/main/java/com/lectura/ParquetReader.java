package com.lectura;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.parquet.column.page.PageReadStore;
import org.apache.parquet.example.data.Group;
import org.apache.parquet.example.data.simple.SimpleGroup;
import org.apache.parquet.example.data.simple.convert.GroupRecordConverter;
import org.apache.parquet.hadoop.ParquetFileReader;
import org.apache.parquet.io.ColumnIOFactory;
import org.apache.parquet.io.InputFile;
import org.apache.parquet.io.MessageColumnIO;
import org.apache.parquet.io.RecordReader;
import org.apache.parquet.io.SeekableInputStream;
import org.apache.parquet.schema.MessageType;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ParquetReader {

    public static void main(String[] args) {
        String carpetaEntrada = "C:\\Users\\centr\\Desktop\\ejemplo\\CasosClinicosParquet";
        String carpetaSalida = "C:\\Users\\centr\\Desktop\\ejemplo\\CasosClinicosJson";
        
        // Permitir pasar carpeta como argumento
        if (args.length > 0) {
            carpetaEntrada = args[0];
        }
        if (args.length > 1) {
            carpetaSalida = args[1];
        }
        
        System.out.println("═══════════════════════════════════════════");
        System.out.println("CONVERSOR MASIVO PARQUET -> JSON");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Carpeta: " + carpetaEntrada + "\n");
        System.out.println("Carpeta salida: " + carpetaSalida + "\n");
        
        try {
            procesarCarpeta(carpetaEntrada, carpetaSalida);
        } catch (Exception e) {
            System.err.println("Error: " + e. getMessage());
            e.printStackTrace();
        }
    }
    
    public static void procesarCarpeta(String carpetaPath, String carpetaSalidaPath) throws Exception {
        Path carpeta = Paths.get(carpetaPath);
        Path carpetaSalida = Paths.get(carpetaSalidaPath);
        
        if (!Files.exists(carpeta) || ! Files.isDirectory(carpeta)) {
            throw new IOException("La carpeta no existe: " + carpetaPath);
        }

        if (!Files.exists(carpetaSalida) || !Files.isDirectory(carpetaSalida)) {
            throw new IOException("La carpeta de salida no existe: " + carpetaSalidaPath);
        }
        
        // Buscar todos los archivos .parquet en la carpeta
        List<Path> archivosParquet;
        try (Stream<Path> paths = Files.walk(carpeta)) {
            archivosParquet = paths
            .filter(Files::isRegularFile)
            .filter(p -> p.toString().toLowerCase().endsWith(".parquet"))
            .collect(Collectors.toList());
        }
    
        if (archivosParquet.isEmpty()) {
            System.out. println("No se encontraron archivos .parquet en la carpeta");
            return;
        }
    
        System.out.println("Archivos encontrados: " + archivosParquet.size());
        System.out.println("═══════════════════════════════════════════\n");
    
        int exitosos = 0;
        int errores = 0;
    
        for (int i = 0; i < archivosParquet.size(); i++) {
            Path archivoParquet = archivosParquet.get(i);
            String nombreArchivo = archivoParquet.getFileName().toString();
        
            System.out.println("───────────────────────────────────────────");
            System.out.println("Archivo [" + (i + 1) + "/" + archivosParquet.size() + "] " + nombreArchivo);
            System.out.println("───────────────────────────────────────────");
        
            try {
            // Generar nombre del JSON (mismo nombre, extensión .json)
            String nombreJson = nombreArchivo.replaceAll("\\.parquet$", ". json");
            // CAMBIO AQUÍ: guardar en carpetaSalida en vez de junto al parquet
            String rutaJson = carpetaSalida.resolve(nombreJson).toString();
            
            convertirParquetAJson(archivoParquet. toString(), rutaJson);
            exitosos++;
            
            } catch (Exception e) {
                System.err.println("Error procesando " + nombreArchivo + ": " + e.getMessage());
                errores++;
            }
        
            System.out.println();
        }
    
        // Resumen final
        System.out.println("═══════════════════════════════════════════");
        System.out.println("PROCESO COMPLETADO");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Exitosos: " + exitosos);
        if (errores > 0) {
            System.out.println("Errores: " + errores);
        }
        System.out.println("═══════════════════════════════════════════");
    }
    
    public static void convertirParquetAJson(String inputPath, String outputPath) throws Exception {
        File file = new File(inputPath);
        
        if (!file.exists()) {
            throw new IOException("El archivo no existe: " + inputPath);
        }
        
        System.out.println("Tamaño: " + String.format("%.2f MB", file.length() / (1024.0 * 1024.0)));
        
        InputFile inputFile = new LocalInputFile(file);
        List<Map<String, Object>> registros = new ArrayList<>();
        
        try (ParquetFileReader reader = ParquetFileReader.open(inputFile)) {
            
            MessageType schema = reader.getFooter(). getFileMetaData().getSchema();
            System.out.println("Campos: " + schema.getFieldCount());
            
            PageReadStore pages;
            int totalFilas = 0;
            
            while ((pages = reader.readNextRowGroup()) != null) {
                long filas = pages.getRowCount();
                MessageColumnIO columnIO = new ColumnIOFactory().getColumnIO(schema);
                RecordReader<Group> recordReader = columnIO.getRecordReader(
                    pages, 
                    new GroupRecordConverter(schema)
                );
                
                for (int i = 0; i < filas; i++) {
                    SimpleGroup group = (SimpleGroup) recordReader.read();
                    Map<String, Object> registro = new HashMap<>();
                    
                    for (int j = 0; j < schema.getFieldCount(); j++) {
                        try {
                            String nombreCampo = schema.getFieldName(j);
                            int repeticiones = group.getFieldRepetitionCount(j);
                            
                            if (repeticiones > 0) {
                                String valor = group.getValueToString(j, 0);
                                registro.put(nombreCampo, valor);
                            } else {
                                registro.put(nombreCampo, null);
                            }
                        } catch (Exception e) {
                            String nombreCampo = schema.getFieldName(j);
                            registro.put(nombreCampo, null);
                        }
                    }
                    
                    registros.add(registro);
                    totalFilas++;
                    
                    if (totalFilas % 500 == 0) {
                        System.out.print("\rProcesando: " + totalFilas + " registros...");
                    }
                }
            }
            
            System.out.print("\rRegistros: " + totalFilas + "\n");
        }
        
        // Exportar a JSON
        System.out.print("Guardando JSON...");
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        
        try (FileWriter writer = new FileWriter(outputPath)) {
            gson.toJson(registros, writer);
        }
        
        File jsonFile = new File(outputPath);
        System.out.println("OK");
        System.out.println("JSON: " + jsonFile.getName());
        System.out.println("Tamaño JSON: " + String.format("%.2f MB", jsonFile.length() / (1024.0 * 1024.0)));
    }
    
    // Clases helper
    static class LocalInputFile implements InputFile {
        private final File file;
        
        public LocalInputFile(File file) {
            this.file = file;
        }
        
        @Override
        public long getLength() throws IOException {
            return file.length();
        }
        
        @Override
        public SeekableInputStream newStream() throws IOException {
            return new LocalSeekableInputStream(new RandomAccessFile(file, "r"));
        }
    }
    
    static class LocalSeekableInputStream extends SeekableInputStream {
        private final RandomAccessFile raf;
        
        public LocalSeekableInputStream(RandomAccessFile raf) {
            this.raf = raf;
        }
        
        @Override
        public long getPos() throws IOException {
            return raf.getFilePointer();
        }
        
        @Override
        public void seek(long newPos) throws IOException {
            raf.seek(newPos);
        }
        
        @Override
        public void readFully(byte[] bytes) throws IOException {
            raf.readFully(bytes);
        }
        
        @Override
        public void readFully(byte[] bytes, int start, int len) throws IOException {
            raf.readFully(bytes, start, len);
        }
        
        @Override
        public int read(ByteBuffer buf) throws IOException {
            int remaining = buf.remaining();
            byte[] bytes = new byte[remaining];
            int bytesRead = raf.read(bytes);
            if (bytesRead > 0) {
                buf.put(bytes, 0, bytesRead);
            }
            return bytesRead;
        }
        
        @Override
        public void readFully(ByteBuffer buf) throws IOException {
            byte[] bytes = new byte[buf.remaining()];
            raf.readFully(bytes);
            buf.put(bytes);
        }
        
        @Override
        public int read() throws IOException {
            return raf.read();
        }
        
        @Override
        public void close() throws IOException {
            raf.close();
        }
    }
}