package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.ArticleDTO;
import com.outbreak.backend.payload.ArticleResponse;
import com.outbreak.backend.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ArticleController {

    @Autowired
    ArticleService articleService;

    @PostMapping("/admin/article")
    public ResponseEntity<ArticleDTO> addArticle(@Valid @RequestBody ArticleDTO articleDTO) {

        ArticleDTO savedArticleDTO = articleService.addArticle(articleDTO);
        return new ResponseEntity<>(savedArticleDTO, HttpStatus.CREATED);

    }

    @PutMapping("/public/article/{articleId}/image")
    public ResponseEntity<ArticleDTO> updateArticleImage(@PathVariable Long articleId, @RequestParam("image") MultipartFile image) throws IOException {

        ArticleDTO updateArticle = articleService.updateProductImage(articleId, image);
        return new ResponseEntity<>(updateArticle, HttpStatus.OK);

    }

    @DeleteMapping("/admin/article/{articleId}")
    public ResponseEntity<ArticleDTO> deleteArticle(@PathVariable Long articleId){

        ArticleDTO deletedArticle = articleService.deleteArticle(articleId);
        return new ResponseEntity<>(deletedArticle, HttpStatus.OK);

    }

    @GetMapping("/public/article")
    public ResponseEntity<ArticleResponse> getAllArticles(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize" , defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ARTICLES_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){

        ArticleResponse articleResponse = articleService.getAllArticles(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(articleResponse,HttpStatus.OK);

    }

    @GetMapping("/public/articles/keyword/{keyword}")
    public ResponseEntity<ArticleResponse> getArticleByKeyword(@PathVariable String keyword,
                                                               @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                               @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                               @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ARTICLES_BY, required = false) String sortBy,
                                                               @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        ArticleResponse articleResponse = articleService.searchArticleByKeyword(keyword, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(articleResponse, HttpStatus.FOUND);
    }




}
