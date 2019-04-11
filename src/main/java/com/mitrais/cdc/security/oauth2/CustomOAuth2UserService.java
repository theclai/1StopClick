package com.mitrais.cdc.security.oauth2;

import com.mitrais.cdc.domain.Authority;
import com.mitrais.cdc.domain.User;
import com.mitrais.cdc.exception.OAuth2AuthenticationProcessingException;
import com.mitrais.cdc.model.AuthProvider;
import com.mitrais.cdc.repository.UserRepository;
import com.mitrais.cdc.security.UserPrincipal;
import com.mitrais.cdc.security.oauth2.user.OAuth2UserInfo;
import com.mitrais.cdc.security.oauth2.user.OAuth2UserInfoFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    private final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        logger.debug("CustomOAuth2UserService-->loadUser-->oAuth2User [{}]", oAuth2User);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        logger.debug("oAuth2UserRequest.getClientRegistration().getRegistrationId() --> [{}]", oAuth2UserRequest.getClientRegistration().getRegistrationId());
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        logger.debug("oAuth2UserInfo.getEmail() --> [{}]", oAuth2UserInfo.getEmail());
        if(StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findOneByEmailIgnoreCase(oAuth2UserInfo.getEmail());
        User user;
        logger.debug("userOptional.isPresent() [{}]", userOptional.isPresent());
        if(userOptional.isPresent()) {
            user = userOptional.get();
            if(user.getProvider()==null){
                user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
                user.setProviderId(oAuth2UserInfo.getId());
            }
            if(!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();
        logger.warn("CustomOAuth2UserService-->registerNewUser [{}]", oAuth2UserInfo.getName());

        user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setLogin(oAuth2UserInfo.getName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());
        user.setPassword(new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()));
        Set<Authority> authorities = new HashSet<>();
        Authority a = new Authority();
        a.setName("ROLE_USER");
        authorities.add(a);
        user.setAuthorities(authorities);
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setLogin(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());

        return userRepository.save(existingUser);
    }

}
