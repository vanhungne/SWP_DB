package org.example.diamondshopsystem.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DiamondPriceDTO {


    private int diamondId;

    private String cut;

    private double carat;

    private String color;

    private String clarity;

    private double price;
}
