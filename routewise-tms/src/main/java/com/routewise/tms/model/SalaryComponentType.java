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
@Table(name = "salary_component_types")
public class SalaryComponentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer componentTypeId;

    @Column(nullable = false, unique = true, length = 100)
    private String componentTypeName;

    @Column(length = 255)
    private String description;
}
