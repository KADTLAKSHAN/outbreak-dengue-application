package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.Article;
import com.outbreak.backend.payload.ArticleDTO;
import com.outbreak.backend.payload.ArticleResponse;
import com.outbreak.backend.repositories.ArticleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService{

    @Autowired
    ArticleRepository articleRepository;
    @Value("${project.image}")
    private String path;
    @Autowired
    FileService fileService;
    @Autowired
    ModelMapper modelMapper;

    @Override
    public ArticleDTO addArticle(ArticleDTO articleDTO)  {

        Article article = modelMapper.map(articleDTO, Article.class);
        article.setImage("default.png");

        Article savedArticle = articleRepository.save(article);
        return modelMapper.map(savedArticle, ArticleDTO.class);
    }

    @Override
    public ArticleDTO updateProductImage(Long articleId, MultipartFile image) throws IOException {
        //GET ARTICLE FROM DB
        Article articleFromDB = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article","articleId",articleId));

        //UPLOAD IMAGE TO SERVER
        //GET THE FILE NAME OF UPLOADED IMAGE
        String fileName = fileService.uploadImage(path, image);

        //UPDATING THE NEW FILE NAME TO THE PRODUCT
        articleFromDB.setImage(fileName);

        //SAVE UPDATED PRODUCT
        Article updateArticle = articleRepository.save(articleFromDB);

        //RETURN DTO AFTER MAPPING PRODUCT TO DTO
        return modelMapper.map(updateArticle, ArticleDTO.class);
    }

    @Override
    public ArticleDTO deleteArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "articleId", articleId));

        articleRepository.delete(article);

        return modelMapper.map(article, ArticleDTO.class);
    }

    @Override
    public ArticleResponse getAllArticles(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Article> articlePage = articleRepository.findAll(pageDetails);

        List<Article> articles = articlePage.getContent();

        if(articles.isEmpty())
            throw new APIException("Articles not exists");

        List<ArticleDTO> articleDTOS = articles.stream()
                .map(article -> modelMapper.map(article, ArticleDTO.class))
                .toList();

        ArticleResponse articleResponse = new ArticleResponse();
        articleResponse.setContent(articleDTOS);
        articleResponse.setPageNumber(articlePage.getNumber());
        articleResponse.setPageSize(articlePage.getSize());
        articleResponse.setTotalElements(articlePage.getTotalElements());
        articleResponse.setTotalpages(articlePage.getTotalPages());
        articleResponse.setLastPage(articlePage.isLast());

        return articleResponse;
    }

    @Override
    public ArticleResponse searchArticleByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Article> articlePage = articleRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageDetails);

        List<Article> articles = articlePage.getContent();

        if(articles.isEmpty())
            throw new APIException("Article not found with keyword " + keyword);

        List<ArticleDTO> articleDTOS = articles.stream()
                .map(article -> modelMapper.map(article, ArticleDTO.class))
                .toList();

        ArticleResponse articleResponse = new ArticleResponse();
        articleResponse.setContent(articleDTOS);
        articleResponse.setPageNumber(articlePage.getNumber());
        articleResponse.setPageSize(articlePage.getSize());
        articleResponse.setTotalElements(articlePage.getTotalElements());
        articleResponse.setTotalpages(articlePage.getTotalPages());
        articleResponse.setLastPage(articlePage.isLast());
        return articleResponse;
    }

}
