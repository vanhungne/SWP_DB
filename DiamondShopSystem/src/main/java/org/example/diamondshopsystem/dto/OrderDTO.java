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

public class OrderDTO {

    private int orderId;

    private Date orderDate;

    private double orderTotalAmount;

    private String orderDeliveryAddress;

    private boolean status;
}
