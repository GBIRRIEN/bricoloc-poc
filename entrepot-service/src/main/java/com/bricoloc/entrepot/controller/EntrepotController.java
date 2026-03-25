package com.bricoloc.entrepot.controller;

import com.bricoloc.entrepot.model.Entrepot;
import com.bricoloc.entrepot.repository.EntrepotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entrepots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EntrepotController {

    private final EntrepotRepository entrepotRepository;

    @GetMapping
    public List<Entrepot> getAll() {
        return entrepotRepository.findAll();
    }

    @PostMapping
    public Entrepot create(@RequestBody Entrepot entrepot) {
        return entrepotRepository.save(entrepot);
    }
}