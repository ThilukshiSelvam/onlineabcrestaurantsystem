package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.dto.UserQueryResponseDTO;
import com.system.abcrestaurant.request.SubmitUserQueryResponseRequest;
import com.system.abcrestaurant.response.UserQueryResponseMessage;
import com.system.abcrestaurant.service.UserQueryResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/query-responses")
public class UserQueryResponseController {

    private final UserQueryResponseService userQueryResponseService;

    @Autowired
    public UserQueryResponseController(UserQueryResponseService userQueryResponseService) {
        this.userQueryResponseService = userQueryResponseService;
    }

    @PostMapping
    public ResponseEntity<UserQueryResponseMessage> submitUserQueryResponse(@RequestBody SubmitUserQueryResponseRequest request) {
        UserQueryResponseDTO responseDTO = userQueryResponseService.submitUserQueryResponse(request);
        return ResponseEntity.ok(new UserQueryResponseMessage("Response submitted successfully"));
    }
}