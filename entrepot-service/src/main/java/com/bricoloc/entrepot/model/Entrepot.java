package com.bricoloc.entrepot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entrepots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Entrepot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String ville;

    private String pays;
}