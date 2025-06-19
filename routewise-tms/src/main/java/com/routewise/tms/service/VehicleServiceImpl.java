package com.routewise.tms.service;

import com.routewise.tms.dto.VehicleDto;
import com.routewise.tms.exception.ResourceNotFoundException;
import com.routewise.tms.factory.VehicleFactory;
import com.routewise.tms.model.Company;
import com.routewise.tms.model.Employee;
import com.routewise.tms.model.Vehicle;
import com.routewise.tms.model.VehicleType;
import com.routewise.tms.repository.CompanyRepository;
import com.routewise.tms.repository.EmployeeRepository;
import com.routewise.tms.repository.VehicleRepository;
import com.routewise.tms.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements IVehicleService {
    private final VehicleRepository vehicleRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final VehicleFactory vehicleFactory;

    @Override
    public VehicleDto createVehicle(VehicleDto dto) {
        VehicleType type = vehicleTypeRepository.findById(dto.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("VehicleType not found"));
        Employee driver = dto.getAssignedDriverId() != null ?
                employeeRepository.findById(dto.getAssignedDriverId()).orElse(null) : null;
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Vehicle vehicle = vehicleFactory.createVehicle(dto, type, driver, company);
        return mapToDto(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleDto updateVehicle(Integer id, VehicleDto dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        VehicleType type = vehicleTypeRepository.findById(dto.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("VehicleType not found"));
        Employee driver = dto.getAssignedDriverId() != null ?
                employeeRepository.findById(dto.getAssignedDriverId()).orElse(null) : null;
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        vehicle.setLicensePlate(dto.getLicensePlate());
        vehicle.setVehicleType(type);
        vehicle.setAssignedDriver(driver);
        vehicle.setCompany(company);
        return mapToDto(vehicleRepository.save(vehicle));
    }

    @Override
    public void deleteVehicle(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicle.setIsDeleted(true);
        vehicleRepository.save(vehicle);
    }

    @Override
    public VehicleDto getVehicleById(Integer id) {
        Vehicle v = vehicleRepository.findById(id)
                .filter(vehicle -> !Boolean.TRUE.equals(vehicle.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        return mapToDto(v);
    }

    @Override
    public List<VehicleDto> getAllVehicles() {
        return vehicleRepository.findAllByIsDeletedFalse().stream()
                .map(this::mapToDto)
                .toList();
    }

    // Data Mapper Pattern
    private VehicleDto mapToDto(Vehicle v) {
        VehicleDto dto = new VehicleDto();
        dto.setVehicleId(v.getVehicleId());
        dto.setLicensePlate(v.getLicensePlate());
        dto.setVehicleTypeId(v.getVehicleType() != null ? v.getVehicleType().getVehicleTypeId() : null);
        dto.setAssignedDriverId(v.getAssignedDriver() != null ? v.getAssignedDriver().getEmployeeId() : null);
        dto.setCompanyId(v.getCompany() != null ? v.getCompany().getCompanyId() : null);
        return dto;
    }
}
