package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.UserQuery;
import com.system.abcrestaurant.repository.UserQueryRepository;
import com.system.abcrestaurant.request.SubmitUserQueryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {

    private final UserQueryRepository userQueryRepository;

    @Autowired
    public UserQueryServiceImpl(UserQueryRepository userQueryRepository) {
        this.userQueryRepository = userQueryRepository;
    }

    @Override
    public UserQuery submitUserQuery(SubmitUserQueryRequest request) {
        UserQuery userQuery = new UserQuery(request.getUserId(), request.getSubject(), request.getMessage());
        return userQueryRepository.save(userQuery);
    }

    @Override
    public List<UserQuery> getAllUserQueries() {
        return userQueryRepository.findAll();
        }
    }
