package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ShellDTO {

    private int shellId;

    private String shellName;

    private double shellPrice;

    private String shellMaterial;

    private String shellDesign;

    private double shellWeight;
}
