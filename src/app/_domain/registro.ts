export class Registro{
    id: string;
	fechaHora: string;
	pensamiento: string;
	post: string;
	paciente: string;
	campos: Array< {nombreRegistroVariable : string, opciones:  Array< {id : string, valor: string, descripcion : string }> }>;
}