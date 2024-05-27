package org.example.diamondshopsystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "warranties")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Warranties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warranty_id")
    private int warrantiesId;

    @Column(name = "warranty_start_date")
    private Date warrantyStartDate;

    @Column(name = "warranty_expiration_date")
    private Date warrantyExpirationDate;

    @Column(name = "warranty_type")
    private String warrantyType;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id")
    private Products product;
}
