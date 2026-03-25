package com.bricoloc.stock.controller;

import com.bricoloc.stock.dto.StockItemDTO;
import com.bricoloc.stock.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<StockItemDTO> getAll() {
        return stockService.getAll();
    }

    @GetMapping("/entrepot/{entrepotId}")
    public List<StockItemDTO> getByEntrepot(@PathVariable Long entrepotId) {
        return stockService.getByEntrepot(entrepotId);
    }

    @GetMapping("/{id}")
    public StockItemDTO getById(@PathVariable Long id) {
        return stockService.getById(id);
    }

    @PostMapping
    public StockItemDTO create(@Valid @RequestBody StockItemDTO dto) {
        return stockService.create(dto);
    }

    @PutMapping("/{id}")
    public StockItemDTO update(@PathVariable Long id, @Valid @RequestBody StockItemDTO dto) {
        return stockService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stockService.delete(id);
        return ResponseEntity.noContent().build();
    }
}