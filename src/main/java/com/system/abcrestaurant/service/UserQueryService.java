package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.UserQuery;
import com.system.abcrestaurant.request.SubmitUserQueryRequest;

import java.util.List;

public interface UserQueryService {

    UserQuery submitUserQuery(SubmitUserQueryRequest request);
    List<UserQuery> getAllUserQueries();
}