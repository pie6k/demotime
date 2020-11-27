import styled from 'styled-components';
import { useProjectContext } from '~/context/project';
import { routes } from '~/routes';
import { RouteLink } from '~/routes/route';

export function MainMenu() {
  const { project } = useProjectContext();

  return (
    <UIHolder>
      <RouteLink route={routes.project.home} args={{ projectId: project.id }}>
        <UIMenuItem>All Issues</UIMenuItem>
      </RouteLink>
      <RouteLink route={routes.project.inbox} args={{ projectId: project.id }}>
        <UIMenuItem>Inbox</UIMenuItem>
      </RouteLink>
      <RouteLink
        route={routes.project.assigned}
        args={{ projectId: project.id }}
      >
        <UIMenuItem>My Issues</UIMenuItem>
      </RouteLink>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  flex: 1;
  padding: 0px 16px;
`;

const UIMenuItem = styled.a`
  font-style: normal;
  line-height: normal;
  color: rgb(215, 216, 219);
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  height: 28px;
  border-radius: 4px;
  text-decoration: none;
`;
