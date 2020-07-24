/**
 * This widget provides the underlying menu functionality when working with the
 * {@link module:esri/widgets/FeatureTable} widget.
 *
 * ::: esri-md class="panel trailer-1"
 * **Known Limitations**
 * * Not supported in Internet Explorer 11.
 * * [Dark themed](../guide/styling/#themes) CSS is currently not supported.
 * :::
 *
 * The following image displays the default `ButtonMenu` alongside a custom
 * `ButtonMenu` widget within a {@link module:esri/widgets/FeatureTable}.
 *
 * ![default and custom feature table menus](../../assets/img/apiref/widgets/featuretable/combined-menu-items.jpg)
 *
 * @beta
 * @module esri/widgets/FeatureTable/Grid/support/ButtonMenu
 * @amdalias ButtonMenu
 * @since 4.16
 *
 * @see [ButtonMenu.tsx (widget view)]({{ JSAPI_ARCGIS_JS_API_URL }}/widgets/ButtonMenu.tsx)
 * @see [ButtonMenu.scss]({{ JSAPI_ARCGIS_JS_API_URL }}/themes/base/widgets/_ButtonMenu.scss)
 * @see [Sample - FeatureTable Widget](../sample-code/widgets-featuretable/index.html)
 * @see [Sample - FeatureTable widget using a map](../sample-code/widgets-featuretable-map/index.html)
 * @see module:esri/widgets/FeatureTable
 * @see module:esri/widgets/FeatureTable/Grid/support/ButtonMenuViewModel
 * @see module:esri/widgets/FeatureTable/Grid/support/ButtonMenuItem
 */

// esri.core
import { eventKey } from "esri/../../../core/events";
import { HandleOwnerMixin } from "esri/../../../core/HandleOwner";
import { isSome } from "esri/../../../core/maybe";
import { watch } from "esri/../../../core/watchUtils";

// esri.core.accessorSupport
import { aliasOf, property, subclass } from "esri/../../../core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/../../Widget");

// esri.widgets.FeatureTable.Grid.support
import ButtonMenuItem = require("esri/widgets/ButtonMenuItem");
import ButtonMenuViewModel = require("esri/widgets/ButtonMenuViewModel");
import { ButtonMenuConfig } from "esri/widgets/interfaces";

// esri.widgets.support
import { VNode } from "esri/../../support/interfaces";
import Popover = require("esri/../../support/Popover");
import { isRTL, renderable, tsx } from "esri/../../support/widget";

const CSS = {
  base: "esri-button-menu",
  content: "esri-button-menu__content",
  contentWrapper: "esri-button-menu__content-wrapper",
  itemWrapper: "esri-button-menu__item-wrapper",

  label: "esri-button-menu__label",
  icon: "esri-button-menu__icon",

  item: "esri-button-menu__item",
  itemLabel: "esri-button-menu__item-label",
  itemLabelContent: "esri-button-menu__item-label-content",
  selectableMenuItem: "esri-button-menu__item--selectable",
  selectedMenuItem: "esri-button-menu__item--selected",

  checkbox: "esri-button-menu__checkbox",
  embeddedContentWrapper: "esri-button-menu__embedded-content-wrapper",

  // icons
  button: "esri-button-menu__button",
  buttonSelected: "esri-button-menu__button--selected",
  defaultIconClass: "esri-icon-menu",

  // common
  widget: "esri-widget"
};

@subclass("esri.widgets.FeatureTable.Grid.support.ButtonMenu")
class ButtonMenu extends HandleOwnerMixin(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  /**
   * @constructor
   * @alias module:esri/widgets/FeatureTable/Grid/support/ButtonMenu
   * @extends module:esri/widgets/Widget
   * @param {Object} [properties] - See the [properties](#properties-summary) for a list of all the properties
   *                              that may be passed into the constructor.
   *
   * @example
   * // Typical usage for ButtonMenu widget.
   * const buttonMenu = new ButtonMenu ({
   *   iconClass: "esri-icon-left",
   *   items: [{
   *     label: "custom menu item label",
   *     iconClass: "Icon font name, if applicable",
   *     clickFunction: function (event) {
   *        // Add custom function to perform on menu item button click
   *     }
   *   }]
   * });
   *
   */

  constructor(params?: ButtonMenuConfig, parentNode?: string | Element) {
    super(params, parentNode);
  }

  initialize(): void {
    // #28536
    this.when(() => {
      this._popover = new Popover({
        owner: this,
        placement: isRTL() ? "bottom-start" : "bottom-end",
        renderContentFunction: this.renderMenuContent,
        anchorElement: this._rootNode
      });
      // Sync properties
      this.handles.add([watch(this, "open", (isOpen) => this._popover.set("open", isOpen))]);
    });

    document.addEventListener("click", (event) => this._handleOutsideClick(event));
  }

  destroy(): void {
    this._popover?.destroy();
    this._popover = null;
    document.removeEventListener("click", (event) => this._handleOutsideClick(event));
  }

  private _handleOutsideClick(event: MouseEvent): void {
    if (!this.open || !this._rootNode || !this._menuContentNode) {
      return;
    }

    const element = event.target as HTMLElement;

    if (!this._menuContentNode?.contains(element) && !this._rootNode?.contains(element)) {
      this.open = false;
    }
  }
  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _menuContentNode: HTMLElement = null;

  private _popover: Popover = null;

  private _rootNode: HTMLElement = null;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  iconClass
  //----------------------------------

  /**
   *  Adds a CSS class to the menu button's DOM node.
   *
   * ![featuretable widget menu items](../../assets/img/apiref/widgets/featuretable/button-menu-icon-class.png)
   *
   * @name iconClass
   * @instance
   * @type {string}
   */
  @property()
  @renderable()
  iconClass: string = null;

  //----------------------------------
  //  items
  //----------------------------------

  /**
   * An array of individual {@link module:esri/widgets/FeatureTable/Grid/support/ButtonMenuItem menu items}.
   *
   * @name items
   * @instance
   * @type {module:esri/widgets/FeatureTable/Grid/support/ButtonMenuItem[]}
   * @autocast
   *
   * @example
   * // Typical usage for ButtonMenuItem
   * const buttonMenuItem1 = new ButtonMenuItem ({
   *   label: "custom menu item label",
   *   iconClass: "Icon font name, if applicable",
   *   clickFunction: function (event) {
   *     // Add custom function to perform on menu item button click
   *   }
   * });
   *
   * const buttonMenuItem2 = new ButtonMenuItem ({
   *   label: "Second custom menu item label",
   *   iconClass: "Second icon font name, if applicable",
   *   clickFunction: function (event) {
   *     // Add second custom function to perform on menu item button click
   *   }
   * });
   *
   *    * // Apply the button menu items above to the button menu
   * const buttonMenu = new ButtonMenu ({
   *   iconClass: "esri-icon-left",
   *   items: [buttonMenuItem1, buttonMenuItem2]
   * });
   *
   */
  @aliasOf("viewModel.items")
  items: ButtonMenuItem[] = null;

  //----------------------------------
  //  label
  //----------------------------------

  /**
   * The widget's default label.
   *
   * @name label
   * @instance
   * @type {string}
   */
  @property()
  @renderable()
  label: string = null;

  //----------------------------------
  //  open
  //----------------------------------

  /**
   * Indicates if the menu content is visible.
   *
   * @name open
   * @instance
   * @type {boolean}
   * @default false
   */
  @aliasOf("viewModel.open")
  open: boolean = false;

  //----------------------------------
  //  viewModel
  //----------------------------------

  /**
   * The view model for this widget. This is a class that contains all the logic
   * (properties and methods) that controls this widget's behavior. See the
   * {@link module:esri/widgets/FeatureTable/Grid/support/ButtonMenuViewModel} class to access
   * all properties and methods on the widget.
   *
   * @name viewModel
   * @instance
   * @type {module:esri/widgets/FeatureTable/Grid/support/ButtonMenuViewModel}
   * @autocast
   */
  @property()
  @renderable(["viewModel.items", "viewModel.open"])
  viewModel: ButtonMenuViewModel = new ButtonMenuViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render(): VNode {
    return (
      <div
        afterCreate={this._afterRootNodeCreate}
        bind={this}
        data-node-ref="_rootNode"
        class={this.classes(CSS.base, CSS.widget)}
        key="menu"
      >
        {this.renderMenuButton()}
      </div>
    );
  }

  protected renderMenuButton(): VNode {
    const { iconClass, id, label, open } = this;
    const menuButtonClasses = this.classes([
      CSS.button,
      iconClass || CSS.defaultIconClass,
      open ? CSS.buttonSelected : null
    ]);

    return (
      <button
        aria-pressed={open.toString()}
        aria-controls={`${id}-menu`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        bind={this}
        class={menuButtonClasses}
        id={`${id}-button`}
        title={label}
        selected={open}
        onclick={this._toggleOpen}
        tabIndex={0}
      />
    );
  }

  protected renderMenuContent(): VNode {
    const { id, open } = this;

    return (
      <div
        afterCreate={this._afterMenuContentNodeCreate}
        bind={this}
        class={CSS.content}
        data-node-ref="_menuContentNode"
        key="esri-button-menu-content"
        hidden={!open}
      >
        <ul
          aria-labelledby={`${id}-button`}
          bind={this}
          class={CSS.itemWrapper}
          id={`${id}-menu`}
          role="menu"
        >
          {this.items?.length && this.renderItems()}
        </ul>
      </div>
    );
  }

  protected renderItems(): VNode {
    return this.items?.map((item, index) => this.renderItem(item, index));
  }

  protected renderItem(item: ButtonMenuItem, index: number, subIndex?: number): VNode {
    const itemId = isSome(subIndex)
      ? `${this.id}-menu-item-${index}-${subIndex}`
      : `${this.id}-menu-item-${index}`;

    const labelId = `${itemId}-label`;
    const itemClasses = this.classes(
      CSS.item,
      item.selectionEnabled ? CSS.selectableMenuItem : null,
      item.selectionEnabled && item.selected ? CSS.selectedMenuItem : null
    );

    return (
      <li
        afterCreate={this._afterMenuItemCreate}
        bind={this}
        class={itemClasses}
        data-item-index={index}
        data-item-subIndex={subIndex}
        for={itemId}
        key={itemId}
        onkeydown={(event) => this._handleMenuItemKeydown(event, item)}
        role="menuitem"
        tabindex="-1"
      >
        <input
          checked={item.selected}
          class={CSS.checkbox}
          id={itemId}
          name={itemId}
          tabindex="-1"
          type="checkbox"
        />
        <label
          bind={this}
          class={this.classes(CSS.button, CSS.itemLabel)}
          for={itemId}
          id={labelId}
          onclick={(event) => this._handleMenuItemInteraction(event, item)}
        >
          <span class={this.classes(CSS.icon, item.iconClass)} aria-hidden={true} />
          <span class={CSS.itemLabelContent}>{item.label}</span>
        </label>
        <ul
          aria-labelledby={labelId}
          class={CSS.embeddedContentWrapper}
          id={`${this.id}-submenu`}
          role="menu"
        >
          {item?.items?.map((subItem, subIndex) => this.renderItem(subItem, index, subIndex))}
        </ul>
      </li>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _afterRootNodeCreate(element: HTMLElement): void {
    this._rootNode = element;
    this._popover?.set("anchorElement", () => element); // #28536
  }

  private _handleMenuItemInteraction(
    event: KeyboardEvent | MouseEvent,
    item: ButtonMenuItem
  ): void {
    item.selected = !item.selected;
    item.open = !!(item.selected && item.items);
    item.autoCloseMenu && this.set("open", false);
    item.clickFunction && item.clickFunction({ event, item });
  }

  private _handleMenuItemKeydown(event: KeyboardEvent, item: ButtonMenuItem): void {
    const key = eventKey(event);

    if (key === "Enter" || key === " ") {
      this._handleMenuItemInteraction(event, item);
    }

    if (key === "Escape") {
      this.open = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private _afterMenuContentNodeCreate(element: HTMLElement): void {
    this._menuContentNode = element;
    element.focus();
  }

  private _toggleOpen(): void {
    this.open = !this.open;
  }

  private _afterMenuItemCreate(element: HTMLLIElement): void {
    const index = element["data-item-index"];

    if (index === 0) {
      element.focus();
    }
  }
}

export = ButtonMenu;