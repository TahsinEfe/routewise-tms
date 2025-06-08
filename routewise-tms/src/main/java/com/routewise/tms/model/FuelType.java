package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "fuel_types")
public class FuelType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fuel_type_id")
    private Integer fuelTypeId;

    @Column(name = "fuel_type_name", nullable = false, unique = true, length = 50)
    private String fuelTypeName;

    @Column(name = "description", length = 255)
    private String description;
}
