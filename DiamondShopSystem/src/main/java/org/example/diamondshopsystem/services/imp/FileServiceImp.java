package org.example.diamondshopsystem.services.imp;

import org.springframework.core.io.Resource;

import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImp {
    boolean saveFile(MultipartFile file);
    Resource loadFile(String filename);

}
