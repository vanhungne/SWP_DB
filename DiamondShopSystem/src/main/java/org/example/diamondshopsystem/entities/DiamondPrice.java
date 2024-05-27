package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "diamondprice")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter


public class DiamondPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diamond_id")
    private int diamondId;
    @Column(name = "cut")
    private String cut;

    @Column(name = "carat")
    private double carat;

    @Column(name = "color")
    private String color;

    @Column(name = "clarity")
    private String clarity;

    @Column(name = "price")
    private double price;
}
