package com.bricoloc.stock.service;

import com.bricoloc.stock.dto.StockItemDTO;
import com.bricoloc.stock.model.StockItem;
import com.bricoloc.stock.repository.StockItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockItemRepository stockRepo;

    public List<StockItemDTO> getAll() {
        return stockRepo.findAll().stream().map(this::toDTO).toList();
    }

    public List<StockItemDTO> getByEntrepot(Long entrepotId) {
        return stockRepo.findByEntrepotId(entrepotId).stream().map(this::toDTO).toList();
    }

    public StockItemDTO getById(Long id) {
        return toDTO(stockRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Non trouvé: " + id)));
    }

    public StockItemDTO create(StockItemDTO dto) {
        StockItem item = StockItem.builder()
            .nomOutil(dto.getNomOutil())
            .categorie(dto.getCategorie())
            .quantiteDisponible(dto.getQuantiteDisponible())
            .quantiteTotale(dto.getQuantiteTotale())
            .entrepotId(dto.getEntrepotId())
            .build();
        return toDTO(stockRepo.save(item));
    }

    public StockItemDTO update(Long id, StockItemDTO dto) {
        StockItem item = stockRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Non trouvé: " + id));
        item.setNomOutil(dto.getNomOutil());
        item.setCategorie(dto.getCategorie());
        item.setQuantiteDisponible(dto.getQuantiteDisponible());
        item.setQuantiteTotale(dto.getQuantiteTotale());
        item.setEntrepotId(dto.getEntrepotId());
        return toDTO(stockRepo.save(item));
    }

    public void delete(Long id) {
        stockRepo.deleteById(id);
    }

    private StockItemDTO toDTO(StockItem item) {
        return StockItemDTO.builder()
            .id(item.getId())
            .nomOutil(item.getNomOutil())
            .categorie(item.getCategorie())
            .quantiteDisponible(item.getQuantiteDisponible())
            .quantiteTotale(item.getQuantiteTotale())
            .entrepotId(item.getEntrepotId())
            .build();
    }
}