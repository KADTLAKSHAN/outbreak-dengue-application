package com.outbreak.backend.service;

import com.outbreak.backend.payload.ArticleDTO;
import com.outbreak.backend.payload.ArticleResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ArticleService {
    ArticleDTO addArticle(ArticleDTO articleDTO);

    ArticleDTO updateProductImage(Long articleId, MultipartFile image) throws IOException;

    ArticleDTO deleteArticle(Long articleId);

    ArticleResponse getAllArticles(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ArticleResponse searchArticleByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
