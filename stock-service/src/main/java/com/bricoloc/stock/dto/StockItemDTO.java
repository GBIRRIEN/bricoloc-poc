package com.bricoloc.stock.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockItemDTO {
    private Long id;

    @NotBlank
    private String nomOutil;

    @NotBlank
    private String categorie;

    @NotNull @Min(0)
    private Integer quantiteDisponible;

    @NotNull @Min(0)
    private Integer quantiteTotale;

    @NotNull
    private Long entrepotId;
}