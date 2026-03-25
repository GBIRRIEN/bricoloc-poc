package com.bricoloc.stock.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomOutil;

    @Column(nullable = false)
    private String categorie;

    @Column(nullable = false)
    private Integer quantiteDisponible;

    @Column(nullable = false)
    private Integer quantiteTotale;

    @Column(nullable = false)
    private Long entrepotId;
}