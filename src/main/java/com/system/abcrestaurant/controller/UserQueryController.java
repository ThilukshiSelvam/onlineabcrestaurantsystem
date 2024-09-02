package com.system.abcrestaurant.controller;

import com.system.abcrestaurant.model.UserQuery;
import com.system.abcrestaurant.request.SubmitUserQueryRequest;
import com.system.abcrestaurant.service.UserQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-queries")
public class UserQueryController {

    private final UserQueryService userQueryService;

    @Autowired
    public UserQueryController(UserQueryService userQueryService) {
        this.userQueryService = userQueryService;
    }

    @PostMapping
    public ResponseEntity<UserQuery> submitUserQuery(@RequestBody SubmitUserQueryRequest request) {
        UserQuery userQuery = userQueryService.submitUserQuery(request);
        return ResponseEntity.ok(userQuery);
    }
}