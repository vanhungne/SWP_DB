package org.example.diamondshopsystem.services;

import jakarta.annotation.PostConstruct;
import org.example.diamondshopsystem.services.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService implements FileServiceImp {

    @Value("${fileUpload.rootPath}")
    private String rootPath;
    private Path root;

    @PostConstruct
    private void init() {
        root = Paths.get(rootPath);
        // Tạo thư mục nếu không tồn tại
        if (Files.notExists(root)) {
            try {
                Files.createDirectories(root);
            } catch (IOException e) {
                System.out.println("ERROR creating root folder: " + e.getMessage());
            }
        }
    }


    @Override
    public boolean saveFile(MultipartFile file) {
        try{
            init();
             Files.copy(file.getInputStream(), root.resolve(file.getOriginalFilename()),StandardCopyOption.REPLACE_EXISTING);

        return true;

        }catch (Exception e){
            System.out.println("ERROR save file "+e.getMessage());
            return false;
        }

    }

    @Override
    public Resource loadFile(String filename) {
        try{
            init();
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if(resource.exists() || resource.isReadable()){
                return resource;
            }

        }catch (Exception e){
            System.out.println("ERROR load file "+e.getMessage());
            return null;
        }
        return null;
    }
}
