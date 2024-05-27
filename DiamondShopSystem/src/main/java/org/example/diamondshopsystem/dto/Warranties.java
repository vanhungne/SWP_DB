package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class Warranties {

    private int warrantiesId;

    private Date warrantyStartDate;

    private Date warrantyExpirationDate;

    private String warrantyType;
}
