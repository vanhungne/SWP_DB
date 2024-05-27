package org.example.diamondshopsystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private int paymentsId;

    @Column(name = "payment_amount")
    private int paymentAmount;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "payment_time")
    private Date paymentTime;

    @Column(name = "description")
    private String description;

    @Column(name = "payment_code")
    private String paymentCode;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "order_id")
    private Order order;

}
