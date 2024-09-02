package com.system.abcrestaurant.service;

import com.system.abcrestaurant.dto.UserQueryResponseDTO;
import com.system.abcrestaurant.model.User;
import com.system.abcrestaurant.model.UserQuery;
import com.system.abcrestaurant.model.UserQueryResponse;
import com.system.abcrestaurant.repository.UserQueryRepository;
import com.system.abcrestaurant.repository.UserQueryResponseRepository;
import com.system.abcrestaurant.repository.UserRepository;
import com.system.abcrestaurant.request.SubmitUserQueryResponseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserQueryResponseServiceImpl implements UserQueryResponseService {

    private final UserQueryResponseRepository userQueryResponseRepository;
    private final UserQueryRepository userQueryRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserQueryResponseServiceImpl(UserQueryResponseRepository userQueryResponseRepository,
                                        UserQueryRepository userQueryRepository,
                                        UserRepository userRepository) {
        this.userQueryResponseRepository = userQueryResponseRepository;
        this.userQueryRepository = userQueryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserQueryResponseDTO submitUserQueryResponse(SubmitUserQueryResponseRequest request) {
        Optional<UserQuery> userQuery = userQueryRepository.findById(request.getQueryId());
        Optional<User> responder = userRepository.findById(request.getResponderId());

        if (userQuery.isPresent() && responder.isPresent()) {
            UserQueryResponse response = new UserQueryResponse(
                    userQuery.get(),
                    responder.get(),
                    request.getResponseMessage()
            );
            UserQueryResponse savedResponse = userQueryResponseRepository.save(response);
            return new UserQueryResponseDTO(
                    savedResponse.getUserQuery().getId(),
                    savedResponse.getRespondedBy().getUsername(),
                    savedResponse.getResponseMessage(),
                    savedResponse.getResponseTime()
            );
        } else {
            throw new IllegalArgumentException("Invalid Query ID or Responder ID");
        }
    }
}