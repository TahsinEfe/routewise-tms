package com.routewise.tms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer companyId;

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String companyAddress;

    @Column(length = 20)
    private String companyPhone;

    @Column(length = 100)
    private String companyEmail;

    @Column(length = 255)
    private String companyWebsite;

    @Column(length = 100)
    private String contactPerson;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

