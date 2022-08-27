import { Color, Highlighting, Route } from "./models";
import { generateRandomColorRGBA } from "./utility";

const colors: Highlighting[] = [
  { key: "empty", color: "rgba(84, 181, 75, 0.25)" },
];

highlighting();

addEventListener("hashchange", (event) => {
  highlighting();
});

function highlighting() {
  const urlRoute = window.location.pathname.substring(1).replace(".php", "");
  var route = undefined;
  if (urlRoute === "" || urlRoute === "stundenanzeige") {
    route = Route.stundenanzeige;
  }

  if (urlRoute === "stundenerfassung") {
    route = Route.stundenerfassung;
  }

  if (route === undefined) return;

  const config = getConfigByPage(route);

  const rows = document.getElementsByTagName("tr");

  for (let row of rows) {
    // set reserved days for holidays
    if (
      (row.attributes.getNamedItem(config.dataKey)?.value === "" ||
        row.attributes.getNamedItem(config.dataKey)?.value === undefined) &&
      row[route === Route.stundenanzeige ? "className" : "id"] ===
        config.classId
    ) {
      let tds = row.getElementsByTagName("td");
      for (let td of tds) {
        colorTableCell(td, getProjectColor("empty"));
      }

      continue;
    }

    // set project-colors
    if (row.attributes.getNamedItem(config.dataKey)?.value !== "") {
      let projectCell = row.getElementsByTagName("td")[config.columnIndex];

      if (projectCell !== undefined) {
        let key = projectCell.innerText.trim() ?? "empty";
        projectCell.style.background = getProjectColor(key);
      }
    }
  }
}

function colorTableCell(cell: HTMLTableCellElement, color: Color) {
  cell.style.backgroundColor = color;
}

function getProjectColor(key: string): Color {
  let storedColor = colors.find((c) => c.key === key);

  if (storedColor !== undefined) {
    return storedColor.color;
  } else {
    let newColor = generateRandomColorRGBA();
    colors.push({ key: key, color: newColor });

    return newColor;
  }
}

function getConfigByPage(route: Route) {
  if (route === Route.stundenanzeige) {
    return {
      dataKey: "data-lfdnr",
      classId: " ",
      columnIndex: 7,
    };
  } else {
    return {
      dataKey: "data-me",
      classId: "me-",
      columnIndex: 6,
    };
  }
}
