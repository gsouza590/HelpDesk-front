import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Chamado } from "src/app/models/chamado";
import { ChamadoService } from "src/app/services/chamado.service";

@Component({
  selector: "app-chamado-list",
  templateUrl: "./chamado-list.component.html",
  styleUrls: ["./chamado-list.component.css"],
})
export class ChamadoListComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: Chamado[] = [];
  FILTERED_DATA: Chamado[] = [];

  displayedColumns: string[] = [
    "id",
    "titulo",
    "cliente",
    "tecnico",
    "dataAbertura",
    "prioridade",
    "status",
    "acoes",
  ];

  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: ChamadoService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe((resp) => {
      this.ELEMENT_DATA = resp;
      this.dataSource.data = this.ELEMENT_DATA;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == "0") {
      return "BAIXA";
    } else if (prioridade == "1") {
      return "MÉDIA";
    } else {
      return "ALTA";
    }
  }

  retornaStatus(status: any): string {
    if (status == "0") {
      return "ABERTO";
    } else if (status == "1") {
      return "EM ANDAMENTO";
    } else {
      return "ENCERRADO";
    }
  }

  orderByStatus(status: any): void {
    let list: Chamado[] = [];
    this.ELEMENT_DATA.forEach((element) => {
      if (element.status == status) list.push(element);
    });
    this.FILTERED_DATA = list;
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA);
    this.dataSource.paginator = this.paginator;
  }
}
