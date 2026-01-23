package com.users.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // 1. Strict Matching ensures fields match exactly
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        // 2. CRITICAL: Skip Nulls allows us to do Partial Updates (PATCH)
        // If a field in DTO is null, it won't overwrite the existing entity data.
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        
        return modelMapper;
    }
}