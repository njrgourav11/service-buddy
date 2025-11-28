'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { ToggleTheme } from '@/components/ui/toggle-theme';
import { NotificationBell } from "@/components/notification-bell";
import { createPortal } from 'react-dom';
import { useAuth } from "@/context/AuthContext";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from 'lucide-react';
import {
    Home,
    Wrench,
    Zap,
    Droplets,
    Leaf,
    Scissors,
    Users,
    Star,
    FileText,
    Shield,
    RotateCcw,
    Handshake,
    HelpCircle,
    Phone,
    Mail,
    LogOut,
    User,
    LayoutDashboard,
    ShoppingCart,
} from 'lucide-react';
import { useCart } from "@/context/CartContext";

type LinkItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    description?: string;
};

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const { user, role, logout } = useAuth();
    const { cartCount } = useCart();

    const pathname = usePathname();

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (pathname.startsWith('/admin') || pathname.startsWith('/manager') || pathname.startsWith('/technician')) {
        return null;
    }

    return (
        <header
            className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
                    scrolled,
            })}
        >
            <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-2 sm:gap-5">
                    <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:bg-accent rounded-md p-1 sm:p-2">
                        <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 sm:p-2 rounded-lg group-hover:scale-105 transition-transform">
                            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">Service<span className="text-blue-600 dark:text-blue-400">Buddy</span></span>
                    </Link>
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                                    <ul className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow">
                                        {serviceLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-2">
                                        <p className="text-muted-foreground text-sm">
                                            Need help?{' '}
                                            <Link href="/support" className="text-foreground font-medium hover:underline">
                                                Contact support
                                            </Link>
                                        </p>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                                    <div className="grid w-lg grid-cols-2 gap-2">
                                        <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                                            {companyLinks.map((item, i) => (
                                                <li key={i}>
                                                    <ListItem {...item} />
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="space-y-2 p-3">
                                            {companyLinks2.map((item, i) => (
                                                <li key={i}>
                                                    <NavigationMenuLink
                                                        href={item.href}
                                                        className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
                                                        asChild
                                                    >
                                                        <Link href={item.href}>
                                                            <item.icon className="text-foreground size-4" />
                                                            <span className="font-medium">{item.title}</span>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                    <NotificationBell />
                    <ToggleTheme />
                    {user ? (
                        <>
                            {role === 'admin' ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboards
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Select Dashboard</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard">Admin Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/manager/dashboard">Manager Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/technician/dashboard">Technician Dashboard</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (role === 'manager' || role === 'technician') && (
                                <Button variant="ghost" asChild>
                                    <Link href={role === 'manager' ? "/manager/dashboard" : "/technician/dashboard"}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        {role === 'manager' ? "Manager" : "Technician"} Dashboard
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>
                            <Button variant="outline" onClick={() => logout()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="hidden lg:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/auth/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
                {/* Mobile Actions */}
                <div className="flex items-center gap-1 md:hidden">
                    <Button variant="ghost" size="icon" asChild className="relative">
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <NotificationBell />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setOpen(!open)}
                        className="ml-1"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon open={open} className="size-5" duration={300} />
                    </Button>
                </div>
            </nav>
            <MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
                <NavigationMenu className="max-w-full">
                    <div className="flex w-full flex-col gap-y-2">
                        <span className="text-sm font-semibold">Services</span>
                        {serviceLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm font-semibold mt-4">Company</span>
                        {companyLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        {companyLinks2.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                    </div>
                </NavigationMenu>
                <div className="flex flex-col gap-2 border-t pt-4 mt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Theme</span>
                        <ToggleTheme />
                    </div>

                    {user ? (
                        <>
                            {role === 'admin' ? (
                                <>
                                    <div className="px-2 py-1.5 text-sm font-semibold">Dashboards</div>
                                    <Button variant="outline" className="w-full justify-start pl-8" asChild>
                                        <Link href="/admin/dashboard">Admin Dashboard</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start pl-8" asChild>
                                        <Link href="/manager/dashboard">Manager Dashboard</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start pl-8" asChild>
                                        <Link href="/technician/dashboard">Technician Dashboard</Link>
                                    </Button>
                                </>
                            ) : (role === 'manager' || role === 'technician') && (
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={role === 'manager' ? "/manager/dashboard" : "/technician/dashboard"}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        {role === 'manager' ? "Manager" : "Technician"} Dashboard
                                    </Link>
                                </Button>
                            )}
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>
                            <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" className="w-full bg-transparent" asChild>
                                <Link href="/auth/login">Sign In</Link>
                            </Button>
                            <Button className="w-full" asChild>
                                <Link href="/auth/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </MobileMenu>
        </header>
    );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className={cn(
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
                'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
            )}
        >
            <div
                data-slot={open ? 'open' : 'closed'}
                className={cn(
                    'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
                    'size-full p-4',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}

function ListItem({
    title,
    description,
    icon: Icon,
    className,
    href,
    ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
    return (
        <NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2', className)} {...props} asChild>
            <Link href={href}>
                <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
                    <Icon className="text-foreground size-5" />
                </div>
                <div className="flex flex-col items-start justify-center">
                    <span className="font-medium">{title}</span>
                    <span className="text-muted-foreground text-xs">{description}</span>
                </div>
            </Link>
        </NavigationMenuLink>
    );
}

const serviceLinks: LinkItem[] = [
    {
        title: 'Home Cleaning',
        href: '/service/home-cleaning',
        description: 'Professional home cleaning services',
        icon: Home,
    },
    {
        title: 'Plumbing',
        href: '/service/plumbing',
        description: 'Expert plumbing repairs and installations',
        icon: Droplets,
    },
    {
        title: 'Electrical',
        href: '/service/electrical',
        description: 'Licensed electricians for all your needs',
        icon: Zap,
    },
    {
        title: 'Appliance Repair',
        href: '/service/appliance-repair',
        description: 'Fix all your home appliances',
        icon: Wrench,
    },
    {
        title: 'Beauty & Salon',
        href: '/service/beauty-salon',
        description: 'Professional beauty services at home',
        icon: Scissors,
    },
    {
        title: 'Gardening',
        href: '/service/gardening',
        description: 'Lawn care and garden maintenance',
        icon: Leaf,
    },
];

const companyLinks: LinkItem[] = [
    {
        title: 'About Us',
        href: '/about',
        description: 'Learn more about ServiceBuddy',
        icon: Users,
    },
    {
        title: 'Customer Stories',
        href: '/#testimonials',
        description: 'See what our customers say',
        icon: Star,
    },
    {
        title: 'Become a Partner',
        href: '/technician/onboarding',
        icon: Handshake,
        description: 'Join our network of professionals',
    },
];

const companyLinks2: LinkItem[] = [
    {
        title: 'Terms of Service',
        href: '/terms',
        icon: FileText,
    },
    {
        title: 'Privacy Policy',
        href: '/privacy',
        icon: Shield,
    },
    {
        title: 'Refund Policy',
        href: '/refund',
        icon: RotateCcw,
    },
    {
        title: 'Support',
        href: '/support',
        icon: HelpCircle,
    },
    {
        title: 'Contact Us',
        href: '/support',
        icon: Phone,
    },
];


function useScroll(threshold: number) {
    const [scrolled, setScrolled] = React.useState(false);

    const onScroll = React.useCallback(() => {
        setScrolled(window.scrollY > threshold);
    }, [threshold]);

    React.useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    // also check on first load
    React.useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;
}
