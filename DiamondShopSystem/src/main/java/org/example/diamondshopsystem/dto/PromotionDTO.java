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

public class PromotionDTO {


    private int promotionId;

    private String promotionName;

    private Date promotionStartDate;

    private Date promotionEndDate;
}
