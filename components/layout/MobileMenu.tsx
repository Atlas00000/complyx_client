'use client';

import { Drawer } from '@/components/ui';
import Navigation, { NavItem } from './Navigation';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  title?: string;
}

const MobileMenu = ({
  isOpen,
  onClose,
  items,
  title = 'Menu',
}: MobileMenuProps) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="medium"
      title={title}
    >
      <Navigation items={items} orientation="vertical" />
    </Drawer>
  );
};

export default MobileMenu;
