package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PaymentDTO {

    private int paymentsId;

    private int paymentAmount;

    private String paymentMode;

    private Date paymentTime;

    private String description;

    private String paymentCode;
}
