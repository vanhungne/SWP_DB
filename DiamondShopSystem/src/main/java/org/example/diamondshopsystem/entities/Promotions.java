package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "promotions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Promotions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int promotionId;

    @Column(name = "promotion_name")
    private String promotionName;

    @Column(name = "promotion_start_date")
    private Date promotionStartDate;

    @Column(name = "promotion_end_date")
    private Date promotionEndDate;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "employee_id")
    private User employee;

    @OneToMany(mappedBy = "promotion", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<DiscountCodes> discountCodes;
}
