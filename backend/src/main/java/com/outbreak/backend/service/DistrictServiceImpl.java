package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.District;
import com.outbreak.backend.model.Division;
import com.outbreak.backend.payload.DistrictDTO;
import com.outbreak.backend.payload.DistrictResponse;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.repositories.DivisionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistrictServiceImpl implements DistrictService{

    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    DivisionRepository divisionRepository;


    @Override
    public DistrictResponse getAllDistrict(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<District> districtPage = districtRepository.findAll(pageDetails);

        List<District> districts = districtPage.getContent();

        if(districts.isEmpty())
            throw new APIException("Districts not exists");

        List<DistrictDTO> districtDTOS = districts.stream()
                .map(district -> modelMapper.map(district, DistrictDTO.class))
                .toList();

        DistrictResponse districtResponse = new DistrictResponse();
        districtResponse.setContent(districtDTOS);
        districtResponse.setPageNumber(districtPage.getNumber());
        districtResponse.setPageSize(districtPage.getSize());
        districtResponse.setTotalElements(districtPage.getTotalElements());
        districtResponse.setTotalpages(districtPage.getTotalPages());
        districtResponse.setLastPage(districtPage.isLast());

        return districtResponse;
    }

    @Override
    public DistrictResponse searchDistrictByIdOrDistrictName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<District> districtPage;

        // Check if input is a valid districtId (numeric)
        try {
            Long districtId = Long.parseLong(input);
            districtPage = districtRepository.findByDistrictIdOrDistrictNameLikeIgnoreCase(districtId, "%"+ input + "%", pageDetails);
        } catch (NumberFormatException e) {
            // If not numeric, treat it as a district name search
            districtPage = districtRepository.findByDistrictNameLikeIgnoreCase("%" + input + "%", pageDetails);
        }

        List<District> districts = districtPage.getContent();

        if(districts.isEmpty())
            throw new APIException("Districts/District not found with district value");

        List<DistrictDTO> districtDTOS = districts.stream()
                .map(district -> modelMapper.map(district, DistrictDTO.class))
                .toList();

        DistrictResponse districtResponse = new DistrictResponse();
        districtResponse.setContent(districtDTOS);
        districtResponse.setPageNumber(districtPage.getNumber());
        districtResponse.setPageSize(districtPage.getSize());
        districtResponse.setTotalElements(districtPage.getTotalElements());
        districtResponse.setTotalpages(districtPage.getTotalPages());
        districtResponse.setLastPage(districtPage.isLast());
        return districtResponse;
    }

    @Override
    public DistrictDTO createDistrict(DistrictDTO districtDTO) {
        District district = modelMapper.map(districtDTO,District.class);

        District districtFromDB = districtRepository.findByDistrictName(district.getDistrictName());
        if(districtFromDB != null)
            throw new APIException("District with the name " + district.getDistrictName() + " already exists!!!");

        District savedDistrict = districtRepository.save(district);
        return modelMapper.map(savedDistrict,DistrictDTO.class);
    }

    @Override
    public DistrictDTO deleteDistrict(Long districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District","districtId",districtId));

        // Check if division are associated with this division
//        List<Division> divisions = divisionRepository.findByDistrict(district);
//        if (!divisions.isEmpty()) {
//            throw new APIException("Cannot delete districts. It is assigned to divisions.");
//        }

        // Remove division reference from users
        List<Division> divisions = divisionRepository.findByDistrict(district);
        for (Division division : divisions) {
            division.setDistrict(null);
            divisionRepository.save(division);
        }

        districtRepository.delete(district);
        return modelMapper.map(district,DistrictDTO.class);
    }

    @Override
    public DistrictDTO updateDistrict(DistrictDTO districtDTO, Long districtId) {
        District districtFromDB = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District","districtId",districtId));

        districtFromDB.setDistrictName(districtDTO.getDistrictName());
        districtRepository.save(districtFromDB);
        return modelMapper.map(districtFromDB,DistrictDTO.class);
    }
}
