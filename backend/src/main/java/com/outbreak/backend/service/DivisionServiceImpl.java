package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.*;
import com.outbreak.backend.payload.*;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.repositories.DivisionRepository;
import com.outbreak.backend.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DivisionServiceImpl implements DivisionService{

    @Autowired
    DivisionRepository divisionRepository;
    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;


    @Override
    public DivisionDTO createDivision(DivisionDTO divisionDTO) {

        District district = districtRepository.findById(divisionDTO.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District", "districtId", divisionDTO.getDistrictId()));

        Boolean isDivisionNotPresent = true;

        List<Division> divisions = district.getDivisions();

        for (Division value : divisions){
            if(value.getDivisionName().equals(divisionDTO.getDivisionName())){
                isDivisionNotPresent = false;
                break;
            }
        }

        if(isDivisionNotPresent){
            Division division = modelMapper.map(divisionDTO, Division.class);
            division.setDistrict(district);
            Division savedDivision = divisionRepository.save(division);
            return modelMapper.map(savedDivision, DivisionDTO.class);
        }else{
            throw new APIException("Division Already Exist!!!");
        }


    }

    @Override
    public List<DivisionDTO> getAllDivisions() {
        List<Division> divisionList = divisionRepository.findAll();

        if(divisionList.isEmpty())
            throw new APIException("Division data not exists");

        List<DivisionDTO> divisionDTOList = divisionList.stream()
                .map(division -> modelMapper.map(division, DivisionDTO.class))
                .toList();

        return divisionDTOList;
    }

    @Override
    public DivisionDTO deleteDivision(Long divisionId) {
        Division division = divisionRepository.findById(divisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Division","divisionId",divisionId));

        // Check if users are associated with this division
//        List<User> users = userRepository.findByDivision(division);
//        if (!users.isEmpty()) {
//            throw new APIException("Cannot delete division. It is assigned to users.");
//        }

        // Remove division reference from users
        List<User> users = userRepository.findByDivision(division);
        for (User user : users) {
            user.setDivision(null);
            userRepository.save(user);
        }

        divisionRepository.delete(division);
        return modelMapper.map(division,DivisionDTO.class);
    }

    @Override
    public DivisionDTO updateDivision(DivisionDTO divisionDTO, Long divisionId) {
        Division divisionFromDB = divisionRepository.findById(divisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Division","divisionId",divisionId));

        divisionFromDB.setDivisionName(divisionDTO.getDivisionName());
        divisionRepository.save(divisionFromDB);
        return modelMapper.map(divisionFromDB,DivisionDTO.class);
    }

    @Override
    public DivisionResponse searchDivisionByIdOrDivisionName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Division> divisionPage;

        // Check if input is a valid divisionId (numeric)
        try {
            Long divisionId = Long.parseLong(input);
            divisionPage = divisionRepository.findByDivisionIdOrDivisionNameLikeIgnoreCase(divisionId, "%"+ input + "%", pageDetails);
        } catch (NumberFormatException e) {
            // If not numeric, treat it as a division name search
            divisionPage = divisionRepository.findByDivisionNameLikeIgnoreCase("%" + input + "%", pageDetails);
        }

        List<Division> divisions = divisionPage.getContent();

        if(divisions.isEmpty())
            throw new APIException("Divisions/Division not found with division value");

        List<DivisionDTO> divisionDTOS = divisions.stream()
                .map(division -> modelMapper.map(division, DivisionDTO.class))
                .toList();

        DivisionResponse divisionResponse = new DivisionResponse();
        divisionResponse.setContent(divisionDTOS);
        divisionResponse.setPageNumber(divisionPage.getNumber());
        divisionResponse.setPageSize(divisionPage.getSize());
        divisionResponse.setTotalElements(divisionPage.getTotalElements());
        divisionResponse.setTotalpages(divisionPage.getTotalPages());
        divisionResponse.setLastPage(divisionPage.isLast());
        return divisionResponse;
    }

    @Override
    public DivisionResponse getAllDivisionsWithPagination(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Division> divisionPage = divisionRepository.findAll(pageDetails);

        List<Division> divisionList = divisionPage.getContent();

        if(divisionList.isEmpty())
            throw new APIException("Divisions not exists");

        List<DivisionDTO> divisionDTOS = divisionList.stream()
                .map(division -> modelMapper.map(division, DivisionDTO.class))
                .toList();

        DivisionResponse divisionResponse = new DivisionResponse();
        divisionResponse.setContent(divisionDTOS);
        divisionResponse.setPageNumber(divisionPage.getNumber());
        divisionResponse.setPageSize(divisionPage.getSize());
        divisionResponse.setTotalElements(divisionPage.getTotalElements());
        divisionResponse.setTotalpages(divisionPage.getTotalPages());
        divisionResponse.setLastPage(divisionPage.isLast());

        return divisionResponse;
    }
}
