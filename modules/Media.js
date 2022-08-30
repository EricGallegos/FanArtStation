module.exports = class Media{
  static constructor( {name, url, creator, date, uploadedBy, accountURL} ){
    this.name = name || "Lex Luthor";
    this.url = url || "#";
    this.creator = creator || 'goste';
    this.date = new Date();
    this.uploadedBy = uploadedBy;
    this.upvotes = 0;
    this.accountURL = accountURL;
  }
}
