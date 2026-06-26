import styled from 'styled-components';

enum TagColors {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  RED = 'red',
  DARKBLUE = 'dark blue',
  YELLOW = 'yellow',
}

interface StatusTagProps {
  label: string;
  color?: TagColors;
  className?: string;
}

export const statusBackgroundColors = {
  [TagColors.BLUE]: '#EFF8FF',
  [TagColors.GREEN]: '#ECFDF3',
  [TagColors.GREY]: '#F9FAFB ',
  [TagColors.RED]: '#fbe3e0',
  [TagColors.DARKBLUE]: '#c9dff8',
  [TagColors.YELLOW]: '#fff4d3',
};

export const statusFontColors = {
  [TagColors.BLUE]: '#175CD3',
  [TagColors.GREEN]: '#027A48',
  [TagColors.GREY]: '#6C737F',
  [TagColors.RED]: '#60150b',
  [TagColors.DARKBLUE]: '#0a2656',
  [TagColors.YELLOW]: '#896329',
};

const StatusTag = ({ label, color = TagColors.GREY, className }: StatusTagProps) => {
  return (
    <div>
      <Container className={className} backgroundColor={statusBackgroundColors[color]}>
        <Text color={statusFontColors[color]}>{label}</Text>
      </Container>
    </div>
  );
};

const Container = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 12px;
  padding: 4px 12px;
  display: flex;
  gap: 5px;
  width: fit-content;
`;

const Text = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 1.4rem;
  line-height: 14px;
`;

export default StatusTag;
