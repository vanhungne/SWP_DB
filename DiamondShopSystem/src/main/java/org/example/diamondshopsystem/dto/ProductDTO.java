package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ProductDTO {

    private int productId;

    private String productName;

    private double price;

    private int stockQuantity;

    private String collection;

    private String description;

    private String image;
}
