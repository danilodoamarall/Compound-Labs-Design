import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza o markdown de uma skill como leitura, não como texto cru num <pre>.
 *
 *  Antes o corpo saía em mono de 12,5px com ~95 caracteres por linha: tabelas
 *  viravam pipes, links viravam colchetes, títulos não tinham hierarquia. Um
 *  agente lê markdown cru sem problema, mas a página é para uma pessoa também.
 *
 *  react-markdown renderiza para elementos React e ignora HTML cru por padrão,
 *  então o conteúdo de terceiros não injeta script. remark-gfm dá tabela, lista
 *  de tarefa e autolink. Os links abrem em nova aba, porque apontam para fora. */
export function SkillMarkdown({ children }: { children: string }) {
  return (
    <div className="skill-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-teal-deep underline underline-offset-2 hover:text-teal">
              {children}
            </a>
          ),
          // Tabela larga rola dentro do próprio quadro, sem empurrar a página.
          table: ({ children }) => (
            <div className="skill-md-table">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
