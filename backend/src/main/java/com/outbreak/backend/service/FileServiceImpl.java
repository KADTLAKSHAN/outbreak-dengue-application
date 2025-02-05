package com.outbreak.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {
        //FILE NAMES OF CURRENT / ORIGINAL
        String originalFileName = file.getOriginalFilename();

        //GENERATE AN UNIQUE FILE NAME
        String randomId = UUID.randomUUID().toString();
        // mat.jpg
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));
        String filePath = path + File.separator + fileName;

        //CHECK IF PATH EXIST AND CREATE
        File folder = new File(path);
        if(!folder.exists())
            folder.mkdir();

        //UPLOAD SERVER
        Files.copy(file.getInputStream(), Paths.get(filePath));

        //RETURNING FILE NAME
        return fileName;
    }
}
