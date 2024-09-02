package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.DineinTable;
import com.system.abcrestaurant.response.MessageResponse;
import com.system.abcrestaurant.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    @Autowired
    private TableService tableService;

    @PostMapping
    public ResponseEntity<?> createDineinTable(@RequestBody DineinTable dineinTable) {
        try {
            DineinTable createdTable = tableService.createDineinTable(dineinTable);
            return new ResponseEntity<>(new MessageResponse("Table added successfully"), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DineinTable> getTableById(@PathVariable Long id) throws Exception {
        DineinTable dineinTable = tableService.findTableById(id);
        return new ResponseEntity<>(dineinTable, HttpStatus.OK);
    }

    @GetMapping("/getAllDineinTables")
    public ResponseEntity<List<DineinTable>> getAllTables() {
        List<DineinTable> dineinTables = tableService.getAllTables();
        return new ResponseEntity<>(dineinTables, HttpStatus.OK);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateTableAvailability(
            @PathVariable Long id, @RequestBody Map<String, Boolean> availabilityRequest
    ) {
        try {
            boolean isAvailable = availabilityRequest.get("isAvailable");
            tableService.updateTableAvailability(id, isAvailable);
            return new ResponseEntity<>(new MessageResponse("Table availability updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateDineinTableDetails(
            @PathVariable Long id, @RequestBody DineinTable dineinTable
    ) {
        try {
            DineinTable updatedTable = tableService.updateDineinTable(id, dineinTable);
            return new ResponseEntity<>(new MessageResponse("Table details updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        try {
            tableService.deleteTable(id);
            return new ResponseEntity<>(new MessageResponse("Table deleted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}