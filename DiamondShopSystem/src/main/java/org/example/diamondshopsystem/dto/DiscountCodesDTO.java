package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DiscountCodesDTO {

    private int codeId;

    private String code;

    private int discountPercentTage;

    private int codeQuantity;

}
