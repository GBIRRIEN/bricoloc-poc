package com.bricoloc.stock.repository;

import com.bricoloc.stock.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {
    List<StockItem> findByEntrepotId(Long entrepotId);
}