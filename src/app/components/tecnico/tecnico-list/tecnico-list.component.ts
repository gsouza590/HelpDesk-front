import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Tecnico } from "src/app/models/tecnico";
import { TecnicoService } from "src/app/services/tecnico.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-tecnico-list",
  templateUrl: "./tecnico-list.component.html",
  styleUrls: ["./tecnico-list.component.css"],
})
export class TecnicoListComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: Tecnico[] = [];

  displayedColumns: string[] = ["id", "nome", "cpf", "email", "acoes"];

  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private service: TecnicoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.findAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  findAll() {
    this.service.findAll().subscribe(
      (resposta) => {
        this.ELEMENT_DATA = resposta;
        this.dataSource.data = resposta;
      },
      (error) => {
        this.toastr.error("Erro ao carregar técnicos", "Erro");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
