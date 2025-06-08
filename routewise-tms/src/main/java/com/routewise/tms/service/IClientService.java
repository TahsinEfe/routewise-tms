package com.routewise.tms.service;

import com.routewise.tms.dto.ClientDto;

import java.util.List;

public interface IClientService {
    ClientDto createClient(ClientDto dto);
    List<ClientDto> getAllClients();
    ClientDto getClientById(Integer id);
    ClientDto updateClient(Integer id, ClientDto dto);
    void deleteClient(Integer clientId);
}
