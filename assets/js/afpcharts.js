console.log("AFP C80 Charts 1.1");
const inversionesContainer = document.querySelector(
  'div.c80_chart[data-grafico="inversiones"]'
);
const inversionesChartElement = document.createElement("div");
const inversionesLegend = document.createElement("div");
inversionesChartElement.classList.add("chart_container");
inversionesContainer.appendChild(inversionesChartElement);
inversionesContainer.appendChild(inversionesLegend);
inversionesLegend.innerHTML = `<p class="postlegend">En millones de dólares al 28 de febrero de 2020</p>`;

const inversiones = echarts.init(inversionesChartElement);

const inversionesData = afpc80data.inversiones.map((inversion) => {
  return {
    name: inversion.grupo_economico,
    type: "bar",
    data: [inversion.total_usd],
    label: inversion.grupo_economico,
    itemStyle: {
      color: inversion.color,
    },
  };
});

const inversionesDataAlt = [
  {
    name: "Inversiones",
    type: "bar",
    data: afpc80data.inversiones_alt.total_usd.map((usd, index) => {
      return {
        value: usd,
        itemStyle: {
          color: afpc80data.inversiones_alt.colors[index],
        },
      };
    }),
    colorBy: "data",
  },
];

const inversionesOptions = {
  title: {
    text: inversionesContainer.getAttribute("data-title"),
    left: "center",
    textStyle: {
      color: "white",
      fontWeight: "bold",
    },
  },
  textStyle: {
    color: "white",
  },
  tooltip: {},
  legend: {
    show: false,
  },
  xAxis: {
    data: afpc80data.inversiones_alt.grupo_economico,
    axisTick: {
      show: true,
      interval: 0,
    },
    axisLabel: {
      show: true,
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: {},
  series: inversionesDataAlt,
  backgroundColor: "#092132",
};

inversiones.setOption(inversionesOptions);
console.log(inversionesDataAlt);
//2. Diagrama empresas

const diagramaEmpresas = document.querySelector(
  'div.c80_diagram[data-diagram="empresas"]'
);

const dataProperty = window.innerWidth > 768 ? "width" : "height";

if (diagramaEmpresas) {
  const diagramaEmpresasData = afpc80data.inversiones.slice(0, -1);
  diagramaEmpresas.innerHTML = `<div class="graphBar">${diagramaEmpresasData
    .map(
      (grupo, index) =>
        `<span class="grupo_bar" data-id="grupo-${index}" data-porcentaje="${
          grupo.perc_nacional
        }" data-usd="${grupo.total_usd}" data-title="${
          grupo.grupo_economico
        }" style="background-color: ${
          grupo.color
        }; ${dataProperty}: ${grupo.perc_nacional.replace(",", ".")}">
        <i>${grupo.grupo_economico} <br/> $${grupo.total_usd}</i></span>`
    )
    .join("")}</div>`;
  diagramaEmpresas.innerHTML += `<div class="gruposContainer">
  ${diagramaEmpresasData
    .map((grupo, index) => {
      return `<div data-id="grupo-${index}" class="c80afp_grupo-inversion">
    <h3><span style="background-color: ${grupo.color};"></span> ${
        grupo.grupo_economico
      }</h3>
    <ul>
    ${grupo.empresas
      .split(",")
      .map((empresa) => `<li>${empresa}</li>`)
      .join("")}
    </ul>
  </div>`;
    })
    .join("")}</div>`;

  const graphBars = document.querySelectorAll("span.grupo_bar");
  const grupos = document.querySelectorAll("div.c80afp_grupo-inversion");

  [...grupos, ...graphBars].forEach((element) => {
    element.classList.remove("active");
    element.addEventListener("mouseover", (e) => {
      e.preventDefault();
      const id = element.getAttribute("data-id");
      const selected = document.querySelectorAll(`[data-id="${id}"]`);

      selected.forEach((element) => element.classList.add("active"));
    });
    element.addEventListener("mouseout", (e) => {
      e.preventDefault();
      const id = element.getAttribute("data-id");
      const selected = document.querySelectorAll(`[data-id="${id}"]`);

      selected.forEach((element) => element.classList.remove("active"));
    });
  });
}

// Gráfico directores

const directoresDiagramaElement = document.querySelector(
  'div.c80_diagram[data-diagram="directores"]'
);
const directoresContent = document.createElement("div");

const directoresYears = document.createElement("div");
directoresYears.classList.add("directoresYearsWrap");

const directoresYearsWrap = document.createElement("div");
const directoresYearsLeft = document.createElement("div");
const directoresYearsRight = document.createElement("div");
const directoresYearsLegend = document.createElement("div");

directoresDiagramaElement.appendChild(directoresYearsLegend);
directoresYearsWrap.append(directoresYearsLeft, directoresYearsRight);
directoresYears.append(directoresYearsWrap);
directoresYearsLegend.classList.add("directoresYearsLegend");
directoresYearsWrap.classList.add("directoresYears");
directoresYearsLeft.classList.add("directoresYearsLeft");
directoresYearsRight.classList.add("directoresYearsRight");

directoresYearsLegend.innerHTML = `<p class="publico">Cargo público</p><p class="privado">Cargo privado</p>`;
// Years ticks
for (let i = 1970; i < 2026; i++) {
  const yearTick = document.createElement("span");
  yearTick.classList.add("yearTick");
  yearTick.setAttribute("data-year", i);
  if (i % 5 === 0) {
    yearTick.classList.add("yearTickLabel");
  }
  directoresYearsRight.append(yearTick);
}

function buildYears(start, end, colorClass) {
  const bar = document.createElement("div");
  const range = [1970, 2025];
  bar.classList.add(colorClass);
  for (let i = range[0]; i <= range[1]; i++) {
    const blockSpan = document.createElement("span");
    const block = bar.appendChild(blockSpan);
    if (i >= start && i <= end) {
      block.classList.toggle("on");
    } else {
      block.classList.toggle("off");
    }
  }
  return bar.innerHTML;
}

const directoresRows = afpc80data.directores
  .map((director) => {
    return `<div class="personrow">
            <div class="infocol">
              <h4>${director.nombre}</h4>
              <ul>
                <li class="cargo_afp">${director.cargo_afp.afp}</li>
                ${director.cargo_publico
                  .map((cargo) => `<li>${cargo.cargo}</li>`)
                  .join("")}
              </ul>
            </div>
            <div class="datacol">
              <div class="data-row filler-row">${buildYears(
                1970,
                2025,
                "transparent"
              )}</div>
              <div class="data-row afp-row">${buildYears(
                director.cargo_afp.periodo.inicio,
                director.cargo_afp.periodo.fin,
                "afp"
              )}</div>
              ${director.cargo_publico
                .map(
                  (cargo) =>
                    `<div class="data-row public-row">${buildYears(
                      cargo.periodo.inicio,
                      cargo.periodo.fin,
                      "public"
                    )}</div>`
                )
                .join("")}
            </div>
          </div>`;
  })
  .join("");

directoresContent.innerHTML = directoresRows;
directoresDiagramaElement.append(directoresYears);
directoresDiagramaElement.append(directoresContent);
//Mobile scrolling
// Gráfico pensiones pagadas

const pensionesPagadasContainer = document.querySelector(
  'div.c80_chart[data-grafico="pensiones-pagadas"]'
);
const pensionesPagadasChart = document.createElement("div");
const pensionesPagadasLegend = document.createElement("div");

pensionesPagadasChart.classList.add("chart_container");
pensionesPagadasLegend.classList.add("chart_legend");

pensionesPagadasContainer.appendChild(pensionesPagadasChart);
pensionesPagadasContainer.appendChild(pensionesPagadasLegend);

pensionesPagadasLegend.innerHTML = `
<p>Mediana, en pesos chilenos al 31/12/2023.</p>
<p>
<strong>PGU:</strong> Pensión Garantizada Universal (estatal).<br/>
<strong>APS:</strong> Aporte Previsional Solidario (estatal). 
</p>`;

const pensionesPagadas = echarts.init(pensionesPagadasChart);
const ppColors = ["#E35E26", "#5288DA", "#D62E2F"];
const pensionesPagadasData = afpc80data.pensiones_pagadas.map((pension) => {
  return {
    name: pension.grupo,
    type: "bar",
    data: [
      pension.total_con_pgu_aps,
      pension.total_sin_pgu_aps,
      pension.entre_30_35_con_pgu_aps,
      pension.entre_30_35_sin_pgu_aps,
    ],
    label: {
      show: true,
      position: "top",
      formatter: (params) => {
        return params.value
          .toLocaleString("es-ES", {
            style: "currency",
            currency: "CLP",
          })
          .replace("CLP", "");
      },
    },
    itemStyle: {
      color: (c) => {
        return ppColors[c.seriesIndex];
      },
    },
  };
});

const pensionesPagadasOptions = {
  title: {
    text: pensionesPagadasContainer.getAttribute("data-title"),
    left: "center",
    textStyle: {
      color: "white",
      fontWeight: "normal",
    },
  },
  textStyle: {
    color: "white",
  },
  tooltip: {},
  legend: {
    bottom: 10,
    textStyle: {
      color: "white",
    },
    data: [
      {
        name: "Hombre",
        itemStyle: {
          color: ppColors[0],
        },
      },
      {
        name: "Mujer",
        itemStyle: {
          color: ppColors[1],
        },
      },
      {
        name: "Total",
        itemStyle: {
          color: ppColors[2],
        },
      },
    ],
  },
  xAxis: [
    {
      type: "category",
      data: [
        "Total autofinanciado\n (+ PGU / APS)",
        "Total autofinanciado\n (sin PGU / APS)",
        "Total entre 30-35\n años de cotización (autofinanciado + PGU/ APS)",
        "Total entre 30-35\n años de cotización (autofinanciado sin PGU / APS)",
      ],
      axisTick: {
        show: false,
        interval: 0,
      },
      axisLabel: {
        interval: 0,
        show: true,
        width: 200,
        overflow: "truncate",
        ellipsis: "...",
        hideOverlap: false,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: pensionesPagadasData,
  backgroundColor: "#092132",
};

pensionesPagadas.setOption(pensionesPagadasOptions);

// Gráfico comparativo pensiones

const comparativoPensionesContainer = document.querySelector(
  'div.c80_chart[data-grafico="comparativa-pensiones"]'
);
const comparativoPensionesChart = document.createElement("div");
const comparativoPensionesLegend = document.createElement("div");
comparativoPensionesChart.classList.add("chart_container");
comparativoPensionesLegend.classList.add("chart_legend");

comparativoPensionesContainer.appendChild(comparativoPensionesChart);
comparativoPensionesContainer.appendChild(comparativoPensionesLegend);

const comparativoPensiones = echarts.init(comparativoPensionesChart);

comparativoPensionesLegend.innerHTML = `
<div class="extralegend">
<p class="red">Vejez Autofinanciado 
(con PGU/APS)</p>
<p class="blue">Vejez Autofinanciado 
(sin PGU/APS)</p>
<p class="purple">Fuerzas armadas y policías</p>
</div>
<div>
PGU: Pensión Garantizada Universal (estatal).<br/> 
APS: Aporte Previsional Solidario (estatal). </div>
`;

const comparativoPensionesOptions = {
  title: {
    text: comparativoPensionesContainer.getAttribute("data-title"),
    left: "center",
    textStyle: {
      color: "white",
      fontWeight: "normal",
    },
  },
  grid: {
    top: 100,
    bottom: 200,
  },
  textStyle: {
    color: "white",
  },
  tooltip: {},
  legend: {
    top: 30,
    textStyle: {
      color: "white",
    },
    data: [
      {
        name: "Monto promedio",
        icon: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAARCAYAAAB0MEQqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABVSURBVHgB7c+xDYARGIRh/v4vTKBXMJpZjEZCpzCDAeipvu4i95RXXPLq5sNSQq5kfW5/HOKfmez1U00X/3zqAYxAwQgUjEDBCBSMQMEIFIxA8UTEBjOoCuQBE6NjAAAAAElFTkSuQmCC",
      },
      {
        name: "Nº Pensiones pagadas",
      },
    ],
  },
  xAxis: {
    type: "category",
    data: afpc80data.comparativo.categories,
    axisTick: {
      show: true,
      interval: 0,
    },
    axisLabel: {
      interval: 0,
      show: true,
      rotate: 45,
      height: 300,
    },
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Monto promedio",
      type: "bar",
      colorBy: "data",
      data: afpc80data.comparativo.monto_promedio.map((monto, index) => {
        const color = index < 4 ? "#D02427" : index < 8 ? "#0E78F4" : "#D511DD";
        return {
          value: monto,
          itemStyle: {
            color: color,
          },
        };
      }),
      label: {
        show: true,
        position: "top",
        formatter: (params) => {
          return params.value
            .toLocaleString("es-ES", {
              style: "currency",
              currency: "CLP",
            })
            .replace("CLP", "");
        },
        textStyle: {
          color: "white",
        },
      },
    },
    {
      name: "Nº Pensiones pagadas",
      type: "line",
      itemStyle: {
        color: "white",
      },
      lineStyle: {
        color: "white",
      },
      data: afpc80data.comparativo.numero_pensiones,
      label: {
        show: true,
        position: "top",
        formatter: (params) => {
          return params.value
            .toLocaleString("es-ES", {
              style: "currency",
              currency: "CLP",
            })
            .replace("CLP", "");
        },
        borderWidth: 0,
        textStyle: {
          color: "white",
        },
      },
    },
  ],
};

comparativoPensiones.setOption(comparativoPensionesOptions);

// Gráfico resumen
const resumenElement = document.querySelector(
  'div.c80_chart[data-grafico="comparativa-resumen"]'
);
const resumenChart = document.createElement("div");
resumenChart.classList.add("chart_container");
const resumenLegend = document.createElement("div");

resumenLegend.classList.add("chart_legend");

resumenElement.appendChild(resumenChart);
resumenElement.appendChild(resumenLegend);

resumenLegend.innerHTML = `
  <p><strong>PGU:</strong> Pensión Garantizada Universal (estatal).</p>
  <p><strong>APS:</strong> Aporte Previsional Solidario (estatal).</p>
  <p>Datos de Fundación SOL en base a solicitudes por Ley de Transparencia a DIPRECA y CAPREDENA y datos publicados por la Superintendencia 
  de Pensiones.</p>`;

const resumenColors = ["#5288DA", "#E35E26", "#D62E2F", "#D511DD"];
const resumen = echarts.init(resumenChart);
const resumenData = afpc80data.resumen.montos.map((monto, index) => {
  return {
    name: afpc80data.resumen.grupos[index],
    type: "bar",
    data: [monto],
    label: {
      show: true,
      position: "top",
      formatter: (params) => {
        return params.value
          .toLocaleString("es-ES", {
            style: "currency",
            currency: "CLP",
          })
          .replace("CLP", "");
      },
    },
    itemStyle: {
      color: (c) => {
        return resumenColors[c.seriesIndex];
      },
    },
  };
});

const resumenOptions = {
  title: {
    text: resumenElement.getAttribute("data-title"),
    left: "center",
    textStyle: {
      color: "white",
      fontWeight: "normal",
    },
  },
  textStyle: {
    color: "white",
  },
  tooltip: {},
  legend: {
    bottom: 10,
    textStyle: {
      color: "white",
    },
    data: [
      {
        name: "Mujeres",
        itemStyle: {
          color: resumenColors[0],
        },
      },
      {
        name: "Hombres",
        itemStyle: {
          color: resumenColors[1],
        },
      },
      {
        name: "PGU",
        itemStyle: {
          color: resumenColors[2],
        },
      },
      {
        name: "FFAA y Policías",
        itemStyle: {
          color: resumenColors[3],
        },
      },
    ],
  },
  xAxis: {
    type: "category",
    data: ["Promedio de pensiones pagadas por persona  en CLP"],
    axisTick: {
      show: false,
      interval: 0,
    },
    axisLabel: {
      interval: 0,
      show: false,
      width: 200,
    },
  },
  yAxis: {
    type: "value",
  },
  series: resumenData,
  backgroundColor: "#092132",
};

resumen.setOption(resumenOptions);

//build menu

const sections = document.querySelectorAll(".c80_afp-section");
const menuContainer = document.querySelector(".c80_afp-menu");

console.log(sections);
const sectionTitles = [
  "Orígenes",
  "Leyes",
  "Sistema",
  "Donde invierten",
  "Conflictos",
  "Resultado final",
  "Conclusiones",
];

const startMenuItem = document.createElement("li");

const mobileMenuContainer = document.querySelector("ul.mobile-sections-nav");
const additionalMobileMenuContainer = document.createElement("ul");
startMenuItem.innerHTML = `<a href="#inicio">Inicio</a>`;
menuContainer.appendChild(startMenuItem.cloneNode(true));
mobileMenuContainer.appendChild(startMenuItem.cloneNode(true));

sections.forEach((section, index) => {
  const id = section.getAttribute("id");
  const menuItem = document.createElement("li");
  menuItem.innerHTML = `<a href="#${id}">${sectionTitles[index]}</a>`;
  menuContainer.appendChild(menuItem.cloneNode(true));
  mobileMenuContainer.appendChild(menuItem.cloneNode(true));
  additionalMobileMenuContainer.appendChild(menuItem.cloneNode(true));
});

const toggleMenu = document.querySelector("a.mobile-toggle");
const nav = document.querySelector(".afp-header nav.main");

const mobileNavItems = document.querySelectorAll("ul.mobile-sections-nav li a");

mobileNavItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    toggleMenu.classList.remove("active");
    nav.classList.remove("active");
  });
});

toggleMenu.addEventListener("click", function (e) {
  e.preventDefault();
  toggleMenu.classList.toggle("active");
  nav.classList.toggle("active");
});

// Add a wrapper to titles to add background color
const titles = document.querySelectorAll("h2.c80_afp-heading");

titles.forEach((title) => {
  const content = title.innerHTML;
  title.innerHTML = `<span>${content}</span>`;
});

// Add a menu at the end of the header element
const header = document.querySelector("header#inicio");
const headerMenu = document.createElement("nav");
headerMenu.classList.add("mobileNav");
headerMenu.innerHTML = `<span class="toggler">Contenidos webstory pensiones</span>`;
headerMenu.appendChild(additionalMobileMenuContainer);
header.appendChild(headerMenu);

const toggler = document.querySelector(".mobileNav span.toggler");
const mobileMenuHeader = document.querySelector(".mobileNav ul");
toggler.addEventListener("click", function (e) {
  e.preventDefault();
  toggler.classList.toggle("active");
  mobileMenuHeader.classList.toggle("active");
});
